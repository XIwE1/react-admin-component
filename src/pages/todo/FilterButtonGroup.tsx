import React from 'react';
import { Button, Space, Tag } from 'antd';
import { useTodoStore } from '@/store/todoStore';
import { useTranslation } from 'react-i18next';

const FilterButtonGroup: React.FC = () => {
  const { filter, setFilter, todos } = useTodoStore();
  const { t } = useTranslation('common');

  const getFilterCount = (filterType: 'all' | 'today' | 'upcoming' | 'overdue' | 'no-date') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos.filter(todo => {
      if (filterType === 'all') return true;

      if (!todo.dueDate) {
        return filterType === 'no-date';
      }

      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      const isToday = dueDate.getTime() === today.getTime();
      const isUpcoming = dueDate > today;
      const isOverdue = dueDate < today;

      switch (filterType) {
        case 'today':
          return isToday;
        case 'upcoming':
          return isUpcoming;
        case 'overdue':
          return isOverdue;
        case 'no-date':
          return !todo.dueDate;
        default:
          return true;
      }
    }).length;
  };

  const filterOptions = [
    { key: 'all' as const, label: t('all'), icon: '📋' },
    { key: 'today' as const, label: t('today'), icon: '📅' },
    { key: 'upcoming' as const, label: t('upcoming'), icon: '🔮' },
    { key: 'overdue' as const, label: t('overdue'), icon: '⚠️' },
    { key: 'no-date' as const, label: t('no-date'), icon: '📌' },
  ];

  return (
    <div className="mb-4">
      <Space wrap>
        {filterOptions.map((option) => (
          <Button
            key={option.key}
            type={filter === option.key ? 'primary' : 'default'}
            size="small"
            onClick={() => setFilter(option.key)}
            className="flex items-center gap-2"
          >
            <span>{option.icon}</span>
            {option.label}
            <Tag
              size="small"
              className="text-xs"
              style={{
                backgroundColor: filter === option.key ? 'rgba(24, 144, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                borderColor: filter === option.key ? '#1890ff' : '#d9d9d9',
                color: filter === option.key ? '#1890ff' : 'inherit'
              }}
            >
              {getFilterCount(option.key)}
            </Tag>
          </Button>
        ))}
      </Space>

      {/* Current filter status */}
      {filter !== 'all' && (
        <div className="mt-2 text-sm text-gray-500">
          当前筛选: {filterOptions.find(opt => opt.key === filter)?.label}
        </div>
      )}
    </div>
  );
};

export default FilterButtonGroup;
