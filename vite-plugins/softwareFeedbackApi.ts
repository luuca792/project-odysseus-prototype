import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Connect, Plugin, ViteDevServer, PreviewServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

const DATA_DIR = path.resolve(process.cwd(), 'software_feedback');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(body === undefined ? undefined : JSON.stringify(body));
}

async function listTickets(res: ServerResponse) {
  await ensureDataDir();
  const files = (await fs.readdir(DATA_DIR)).filter((f) => f.endsWith('.json'));
  const tickets: unknown[] = [];
  for (const file of files) {
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
      tickets.push(JSON.parse(raw));
    } catch (err) {
      console.warn(`[software-feedback-api] Skipping unparseable ticket file "${file}":`, err);
    }
  }
  sendJson(res, 200, tickets);
}

async function createTicket(req: IncomingMessage, res: ServerResponse) {
  const body = await readBody(req);
  const { category, type, content, authorId, authorName } = body ?? {};
  if (!category || !type || !content || !authorId || !authorName) {
    sendJson(res, 400, { error: 'Missing required fields.' });
    return;
  }
  await ensureDataDir();
  const ticket = {
    id: `${Date.now()}`,
    category,
    type,
    content,
    authorId,
    authorName,
    createdAt: new Date().toISOString(),
    // Pre-populated empty so the developer sees exactly where to type a status/
    // response when hand-editing the file. Empty strings render as "nothing set"
    // in the UI, same as if the fields were absent.
    status: '',
    response: '',
  };
  await fs.writeFile(path.join(DATA_DIR, `${ticket.id}.json`), JSON.stringify(ticket, null, 2), 'utf-8');
  sendJson(res, 201, ticket);
}

async function deleteTicket(req: IncomingMessage, res: ServerResponse, id: string) {
  const body = await readBody(req);
  const filePath = path.join(DATA_DIR, `${id}.json`);
  let existing: any;
  try {
    existing = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  } catch {
    sendJson(res, 404, { error: 'Ticket not found.' });
    return;
  }
  if (existing.authorId !== body?.authorId) {
    sendJson(res, 403, { error: 'Only the ticket owner can delete this ticket.' });
    return;
  }
  await fs.unlink(filePath);
  res.statusCode = 204;
  res.end();
}

function registerRoutes(middlewares: Connect.Server) {
  middlewares.use(async (req, res, next) => {
    const url = req.url ?? '';
    if (!url.startsWith('/api/software-feedback')) return next();

    try {
      const [, idPart] = url.split('/api/software-feedback/');
      if (req.method === 'GET' && !idPart) {
        await listTickets(res);
      } else if (req.method === 'POST' && !idPart) {
        await createTicket(req, res);
      } else if (req.method === 'DELETE' && idPart) {
        await deleteTicket(req, res, decodeURIComponent(idPart.split('?')[0]));
      } else {
        sendJson(res, 404, { error: 'Not found.' });
      }
    } catch (err) {
      console.error('[software-feedback-api] Unexpected error:', err);
      sendJson(res, 500, { error: 'Internal error handling software feedback request.' });
    }
  });
}

export function softwareFeedbackApiPlugin(): Plugin {
  return {
    name: 'software-feedback-api',
    configureServer(server: ViteDevServer) {
      registerRoutes(server.middlewares);
    },
    configurePreviewServer(server: PreviewServer) {
      registerRoutes(server.middlewares);
    },
  };
}
