export const getRemainingTime = (dueDate: string): string => {
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return "无效日期";

  const now = new Date();
  const diff = due.getTime() - now.getTime();

  // Already expired
  if (diff < 0) {
    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days === 0 && hours === 0 && minutes === 0) {
      return "已到期";
    }

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}天`);
    if (hours > 0) parts.push(`${hours}小时`);
    if (days === 0 && hours === 0 && minutes > 0) parts.push(`${minutes}分钟`);

    return `已过期 ${parts.join(" ")}`;
  }

  // Less than 1 minute
  if (diff < 60000) {
    return "即将到期";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (days === 0 && hours === 0 && minutes > 0) parts.push(`${minutes}分钟`);

  return parts.join(" ");
};

export const isOverdue = (dueDate: string, completed: boolean): boolean => {
  const now = new Date();
  const due = new Date(dueDate);
  return !completed && due.getTime() < now.getTime();
};

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "无效日期";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
