import React, { useContext, useMemo } from "react";
import { HolderOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, message } from "antd";
import type { TableProps } from "antd";

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const sortColumn = {
  title: "排序",
  key: "sort",
  dataIndex: "sort",
  align: "center" as const,
  width: 60,
  render: () => <DragHandle />,
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

interface DndWrapperProps<T> {
  onSortChange: (newSource: T[]) => Promise<boolean>;
  rowKey?: string;
  children: React.ReactElement<TableProps<T>>;
  dataSource: T[];
  columns: TableProps<T>["columns"];
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });
  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const DndWrapper = <T extends { key: string }>({
  onSortChange,
  rowKey,
  children,
  dataSource,
  columns = [],
}: DndWrapperProps<T>) => {
  if (!dataSource) return <></>;
  const _dataSource = [...dataSource];
  const _columns = [sortColumn, ...columns];

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = _dataSource.findIndex(
        (record) => record[rowKey || "key"] === active?.id
      );
      const overIndex = _dataSource.findIndex(
        (record) => record[rowKey || "key"] === over?.id
      );
      const newDataSource = arrayMove(_dataSource, activeIndex, overIndex);
      const success = await onSortChange(newDataSource);
      if (success) {
      } else {
        await onSortChange(arrayMove(_dataSource, overIndex, activeIndex));
        message.error("排序修改失败");
      }
    }
  };

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        items={_dataSource?.map((i) => i[rowKey || "key"]) || []}
        strategy={verticalListSortingStrategy}
      >
        {React.cloneElement(children, {
          columns: _columns,
          components: {
            body: {
              row: Row,
            },
          },
        })}
      </SortableContext>
    </DndContext>
  );
};

export default DndWrapper;
