import { create } from "zustand";
import { persist } from "zustand/middleware";

const LOCAL_PERMISSION_KEY = "permission-storage";

export interface PermissionStore {
  buttons: string[];
  forms: string[];
  roles: string[];
  permissions: string[];
  routes: string[];
  isAdmin?: boolean;
  version?: number;
  updatePermissions: (permissions: string[]) => void;
  updateForms: (forms: string[]) => void;
  updateRoles: (roles: string[]) => void;
  updateRoutes: (routes: string[]) => void;
  updateIsAdmin: (isAdmin: boolean) => void;
  updateVersion: (version: number) => void;
}

export const usePermissionStore = create<PermissionStore>()(
  persist(
    (set, get) => ({
      buttons: [],
      forms: [],
      roles: [],
      permissions: [],
      routes: [],
      isAdmin: false,
      version: 1,
      updatePermissions: (permissions: string[]) => set({ permissions }),
      updateForms: (forms: string[]) => set({ forms }),
      updateRoles: (roles: string[]) => set({ roles }),
      updateRoutes: (routes: string[]) => set({ routes }),
      updateIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
      updateVersion: (version: number) => set({ version }),
    }),
    {
      name: LOCAL_PERMISSION_KEY,
      partialize: (state) => ({ permissions: state.permissions }),
    },
  ),
);
