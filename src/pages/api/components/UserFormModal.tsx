import { useEffect, useState } from "react";
import { Form, Input, Modal, message } from "antd";
import type { UserRow } from "../userList/types";

export type UserFormModalMode = "create" | "edit";

export interface UserFormValues {
  ID?: number;
  name: string;
  email: string;
}

export interface UserFormModalProps {
  open: boolean;
  mode: UserFormModalMode;
  /** edit 时传入当前行 */
  editingUser?: UserRow | null;
  /** 提交创建 */
  onCreate: (payload: { name: string; email: string }) => Promise<void>;
  /** 提交更新 */
  onUpdate: (payload: { Id: number; name: string; email: string }) => Promise<void>;
  onClose: () => void;
  /** 创建/更新成功后回调（例如刷新列表） */
  onSuccess?: () => void;
}

/**
 * 用户创建 / 编辑共用弹窗：创建不展示 ID；编辑展示只读 ID。
 */
export function UserFormModal({
  open,
  mode,
  editingUser,
  onCreate,
  onUpdate,
  onClose,
  onSuccess,
}: UserFormModalProps) {
  const [form] = Form.useForm<UserFormValues>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      form.resetFields();
      return;
    }
    if (editingUser) {
      form.setFieldsValue({
        ID: editingUser.ID,
        name: editingUser.name,
        email: editingUser.email ?? "",
      });
    }
  }, [open, mode, editingUser, form]);

  const handleOk = async () => {
    try {
      const v = await form.validateFields();
      setSaving(true);
      if (mode === "create") {
        await onCreate({
          name: v.name.trim(),
          email: v.email.trim(),
        });
        message.success("创建成功");
      } else {
        const id = v.ID;
        if (id === undefined || Number.isNaN(Number(id))) {
          message.error("缺少用户 ID");
          return;
        }
        await onUpdate({
          Id: Number(id),
          name: v.name.trim(),
          email: v.email.trim(),
        });
        message.success("保存成功");
      }
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (e: unknown) {
      if (e && typeof e === "object" && "errorFields" in e) return;
      message.error(e instanceof Error ? e.message : "操作失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={mode === "create" ? "创建用户" : "编辑用户"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      confirmLoading={saving}
      destroyOnClose
      maskClosable={false}
      okText={mode === "create" ? "确认创建" : "确认保存"}
      cancelText="取消"
    >
      <Form<UserFormValues> form={form} layout="vertical" preserve={false}>
        {mode === "edit" ? (
          <Form.Item name="ID" label="ID" rules={[{ required: true, message: "缺少 ID" }]}>
            <Input readOnly tabIndex={-1} />
          </Form.Item>
        ) : null}
        <Form.Item name="name" label="姓名" rules={[{ required: true, message: "请输入姓名" }]}>
          <Input allowClear placeholder="姓名" />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input allowClear placeholder="邮箱" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
