/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  UserCheck,
  Key,
  Check,
  ChevronRight,
  Lock,
} from "lucide-react";

interface NewUserProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    email: string;
    password?: string;
    status?: string;
    permissions?: string[];
  }) => void;
  editingUser?: {
    id: number;
    email: string;
    status: string;
    permissions?: string[];
  } | null;
}

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPermissions: string[];
  onPermissionsChange: (permissions: string[]) => void;
}

function PermissionModal({
  isOpen,
  onClose,
  selectedPermissions,
  onPermissionsChange,
}: PermissionModalProps) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>(selectedPermissions);

  useEffect(() => {
    const storedPermissions = JSON.parse(
      localStorage.getItem("permissions") || "[]",
    );
    setPermissions(storedPermissions);

    const defaultSelected = storedPermissions.filter(
      (perm: string) =>
        perm === "Dashboard" ||
        perm === "Settings" ||
        perm === "Help & Support",
    );
    const combined = Array.from(
      new Set([...defaultSelected, ...selectedPermissions]),
    );
    setSelected(combined);
  }, [selectedPermissions]);

  const handlePermissionToggle = (permission: string) => {
    if (["Dashboard", "Settings", "Help & Support"].includes(permission)) {
      return;
    }
    setSelected((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const handleSave = () => {
    onPermissionsChange(selected);
    onClose();
  };

  if (!isOpen) return null;

  const isDefaultPermission = (permission: string) =>
    ["Dashboard", "Settings", "Help & Support"].includes(permission);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative h-[95vh] w-full max-w-md overflow-hidden bg-white shadow-2xl"
        style={{ borderRadius: "0px" }}
      >
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="flex h-8 w-8 items-center justify-center bg-[var(--color-primary)] text-white"
                style={{ borderRadius: "0px" }}
              >
                <Key className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Access Permissions
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Choose which sections the user can access
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              style={{ cursor: "pointer" }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="h-[calc(100vh-200px)] overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {permissions.map((permission) => (
              <div
                key={permission}
                className={`flex items-center justify-between border p-4 ${
                  selected.includes(permission)
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "border-gray-200"
                }`}
                style={{ borderRadius: "0px" }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center border ${
                      selected.includes(permission)
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-gray-300 bg-white"
                    } ${
                      isDefaultPermission(permission)
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }`}
                    style={{ borderRadius: "0px" }}
                    onClick={() =>
                      !isDefaultPermission(permission) &&
                      handlePermissionToggle(permission)
                    }
                  >
                    {selected.includes(permission) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`block text-sm ${
                        isDefaultPermission(permission)
                          ? "font-medium text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      {permission}
                    </span>
                    {isDefaultPermission(permission) && (
                      <span className="mt-1 text-xs text-gray-400">
                        Required permission
                      </span>
                    )}
                  </div>
                </div>
                {isDefaultPermission(permission) && (
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-0 bottom-0 left-0 flex justify-end space-x-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            style={{ borderRadius: "0px" }}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)]"
            style={{ borderRadius: "0px" }}
          >
            <Check className="mr-2 h-4 w-4" />
            Save Permissions ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewUser({
  isOpen,
  onClose,
  onSave,
  editingUser,
}: NewUserProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    status: "active",
    permissions: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        email: editingUser.email,
        password: "",
        status: editingUser.status,
        permissions: editingUser.permissions || [
          "Dashboard",
          "Settings",
          "Help & Support",
        ],
      });
    } else {
      const storedPermissions = JSON.parse(
        localStorage.getItem("permissions") || "[]",
      );
      const defaultPermissions = storedPermissions.filter(
        (perm: string) =>
          perm === "Dashboard" ||
          perm === "Settings" ||
          perm === "Help & Support",
      );
      setFormData({
        email: "",
        password: "",
        status: "active",
        permissions: defaultPermissions,
      });
    }
  }, [editingUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handlePermissionsChange = (permissions: string[]) => {
    setFormData((prev) => ({
      ...prev,
      permissions: permissions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!editingUser && (!formData.email || !formData.password)) {
      setError("Email and password are required");
      setIsSubmitting(false);
      return;
    }

    try {
      await onSave({
        email: formData.email,
        password: editingUser
          ? formData.password || undefined
          : formData.password,
        status: formData.status,
        permissions: formData.permissions,
      });
      setFormData({
        email: "",
        password: "",
        status: "active",
        permissions: [],
      });
    } catch (error: any) {
      setError(error.message || "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      password: "",
      status: "active",
      permissions: [],
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
        <div
          className="relative w-full max-w-md transform overflow-hidden bg-white shadow-2xl transition-all"
          style={{ borderRadius: "0px" }}
        >
          <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="flex h-8 w-8 items-center justify-center bg-[var(--color-primary)] text-white"
                  style={{ borderRadius: "0px" }}
                >
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingUser ? "Edit User" : "Add New User"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {editingUser
                      ? "Update user details."
                      : "Add a new team member to your collaboration space."}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                style={{ cursor: "pointer" }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 py-5 sm:p-6">
              {error && (
                <div
                  className="mb-4 bg-red-100 p-3 text-sm text-red-700"
                  style={{ borderRadius: "0px" }}
                >
                  {error}
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 flex items-center text-sm font-medium text-gray-700"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:outline-none"
                    placeholder="Enter email address"
                    style={{ borderRadius: "0px" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 flex items-center text-sm font-medium text-gray-700"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Password {editingUser ? "(Optional)" : "*"}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:outline-none"
                    placeholder={
                      editingUser
                        ? "Enter new password (optional)"
                        : "Enter password"
                    }
                    style={{ borderRadius: "0px" }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 flex items-center text-sm font-medium text-gray-700"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23666666%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] w-full appearance-none border border-gray-300 bg-white bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat px-3 py-2.5 text-sm transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:outline-none"
                    style={{ borderRadius: "0px" }}
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
                    <Key className="mr-2 h-4 w-4" />
                    Access Permissions
                  </label>
                  <div
                    onClick={() => setShowPermissionModal(true)}
                    className="flex w-full cursor-pointer items-center justify-between border border-gray-300 px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
                    style={{ borderRadius: "0px" }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">
                        {formData.permissions.length} permissions selected
                      </span>
                      {formData.permissions.length > 0 && (
                        <div className="flex items-center space-x-1">
                          {formData.permissions.slice(0, 2).map((perm, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 px-2 py-1 text-xs text-gray-600"
                            >
                              {perm}
                            </span>
                          ))}
                          {formData.permissions.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{formData.permissions.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Dashboard, Settings, and Help & Support are always enabled
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex w-full items-center justify-center px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors ${
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                } sm:ml-3 sm:w-auto`}
                style={{ borderRadius: "0px" }}
              >
                <User className="mr-2 h-4 w-4" />
                {editingUser ? "Update User" : "Add User"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="mt-3 inline-flex w-full items-center justify-center bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-300 transition-colors ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                style={{ borderRadius: "0px" }}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <PermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        selectedPermissions={formData.permissions}
        onPermissionsChange={handlePermissionsChange}
      />
    </>
  );
}