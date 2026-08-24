import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { usePermission } from '../../context/usePermission';
import type { Goal } from '../../mock-data/types';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal/Modal';
import { TextField } from '../../components/FormField/FormField';
import { ActivityTypeTag } from '../../components/ActivityTypeTag/ActivityTypeTag';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { useToast } from '../../components/Toast/ToastContext';
import styles from './Quota.module.css';

export function Quota() {
  const { activeSubAssociationId } = useAuth();
  const { activities, goals, addGoal, assignActivityToGoal, removeActivityFromGoal } = useAppData();
  const canCreate = usePermission('create-quota');
  const canAssign = usePermission('assign-activity-to-quota');
  const { showToast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [assignModalGoalId, setAssignModalGoalId] = useState<string | null>(null);

  if (!activeSubAssociationId) return null;

  const scopedGoals = goals.filter((g) => g.subAssociationId === activeSubAssociationId);
  const scopedActivities = activities.filter((a) => a.subAssociationId === activeSubAssociationId);
  const assignModalGoal = scopedGoals.find((g) => g.id === assignModalGoalId);

  function handleCreateGoal() {
    if (!newGoalName.trim() || !activeSubAssociationId) return;
    const goal: Goal = {
      id: `goal-${Date.now()}`,
      subAssociationId: activeSubAssociationId,
      termOfOffice: scopedGoals[0]?.termOfOffice ?? '2025–2026',
      name: newGoalName.trim(),
      activityIds: [],
    };
    addGoal(goal);
    showToast('Đã tạo chỉ tiêu mới.');
    setCreateOpen(false);
    setNewGoalName('');
  }

  function toggleAssignment(goal: Goal, activityId: string) {
    if (goal.activityIds.includes(activityId)) {
      removeActivityFromGoal(goal.id, activityId);
    } else {
      assignActivityToGoal(goal.id, activityId);
    }
  }

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1>Chỉ tiêu hoạt động</h1>
          <p className={styles.pageDescription}>Mỗi chỉ tiêu (theo nhiệm kỳ) có thể gán vào nhiều hoạt động.</p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> Tạo chỉ tiêu
          </Button>
        )}
      </div>

      {scopedGoals.length === 0 ? (
        <EmptyState title="Chưa có chỉ tiêu nào" />
      ) : (
        <div className={styles.goalGrid}>
          {scopedGoals.map((goal) => (
            <Card key={goal.id} className={styles.goalCard}>
              <div className={styles.goalHeader}>
                <Target size={18} color="var(--color-primary)" />
                <h3 className={styles.goalName}>{goal.name}</h3>
              </div>
              <p className={styles.goalMeta}>Nhiệm kỳ {goal.termOfOffice}</p>
              <p className={styles.goalMeta}>
                <strong>{goal.activityIds.length}</strong> hoạt động đã gán
              </p>
              {canAssign && (
                <Button variant="secondary" size="sm" onClick={() => setAssignModalGoalId(goal.id)}>
                  Gán hoạt động
                </Button>
              )}
              {goal.activityIds.length > 0 && (
                <ul className={styles.list}>
                  {goal.activityIds.map((activityId) => {
                    const activity = scopedActivities.find((a) => a.id === activityId);
                    if (!activity) return null;
                    return (
                      <li key={activityId}>
                        <Card className={styles.listRow}>
                          <span>{activity.title}</span>
                          <ActivityTypeTag type={activity.type} />
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}

      {createOpen && (
        <Modal
          title="Tạo chỉ tiêu mới"
          onClose={() => setCreateOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateGoal} disabled={!newGoalName.trim()}>
                Tạo chỉ tiêu
              </Button>
            </>
          }
        >
          <TextField
            label="Tên chỉ tiêu"
            placeholder='Ví dụ: "Tổ chức hoạt động tình nguyện"'
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            required
          />
        </Modal>
      )}

      {assignModalGoal && (
        <Modal title={`Gán hoạt động vào: ${assignModalGoal.name}`} onClose={() => setAssignModalGoalId(null)}>
          <ul className={styles.list}>
            {scopedActivities.map((a) => {
              const assigned = assignModalGoal.activityIds.includes(a.id);
              return (
                <li key={a.id}>
                  <Card className={styles.listRow}>
                    <span>{a.title}</span>
                    <Button
                      variant={assigned ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => toggleAssignment(assignModalGoal, a.id)}
                    >
                      {assigned ? 'Đã gán' : 'Gán'}
                    </Button>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Modal>
      )}
    </div>
  );
}
