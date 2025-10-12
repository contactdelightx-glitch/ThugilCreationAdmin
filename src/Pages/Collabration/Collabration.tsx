/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { getAllUsers, createUser, updateUser } from "../../Api";
import NewUser from "./NewUser";

interface User {
  id: number;
  email: string;
  role?: string;
  status: string;
  created_at: string;
  permissions?: string[];
}

interface UserTokenData {
  id: number;
  email: string;
  status: string;
}

export default function CollaborationPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });
  const [currentUser, setCurrentUser] = useState<UserTokenData | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Get current user from token
  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      try {
        // Decode the JWT token to get user info
        const tokenPayload = JSON.parse(atob(tokenData.split('.')[1]));
        setCurrentUser({
          id: tokenPayload.id,
          email: tokenPayload.email,
          status: tokenPayload.status
        });
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      if (!response.ok) throw new Error("Failed to fetch users");
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Server responded with non-JSON content.");
      }
      const data: User[] = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalUsers = users.length;
  const blockedUsers = users.filter((u) => u.status === "blocked").length;
  const activeUsers = totalUsers - blockedUsers;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusColor = (status: string) => {
    if (status === "active") {
      return "bg-green-100 text-green-800";
    }
    return "bg-red-100 text-red-800";
  };

  const getRoleColor = (role?: string) => {
    if (role === "Admin") {
      return "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]";
    }
    return "bg-gray-100 text-gray-600";
  };

  const buttonClass =
    "p-1 text-gray-600 hover:text-[var(--color-primary)] hover:bg-gray-100 transition-colors sm:p-2";
  const iconClass = "h-3 w-3 sm:h-4 sm:w-4";

  const handleAddUser = () => {
    setEditingUser(null);
    setIsNewUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsNewUserModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNewUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteClick = (user: User) => {
    // Check if user is trying to delete their own account
    if (currentUser && currentUser.email === user.email) {
      alert("You cannot delete your own account.");
      return;
    }
    setDeleteConfirmModal({ isOpen: true, user });
  };

  const handleCloseDeleteModal = () => {
    setDeleteConfirmModal({ isOpen: false, user: null });
    setDeleting(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmModal.user) return;

    const user = deleteConfirmModal.user;
    
    // Double check - user shouldn't be able to delete their own account
    if (currentUser && currentUser.email === user.email) {
      alert("You cannot delete your own account.");
      setDeleteConfirmModal({ isOpen: false, user: null });
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`${'http://localhost:4000'}/user/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      fetchUsers();
      setDeleteConfirmModal({ isOpen: false, user: null });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(error.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveUser = async (userData: {
    email: string;
    password?: string;
    status?: string;
    permissions?: string[];
  }) => {
    try {
      let response;
      if (editingUser) {
        // Use the updateUser function from API
        response = await updateUser(editingUser.id, {
          email: userData.email,
          password: userData.password,
          status: userData.status,
          permissions: userData.permissions || [],
        });
      } else {
        if (!userData.email || !userData.password) {
          throw new Error("Email and password are required");
        }
        response = await createUser(
          userData.email,
          userData.password,
          userData.permissions || [],
          userData.status,
        );
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save user");
      }
      
      setIsNewUserModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Error saving user:", error);
      throw error;
    }
  };

  const getEmailPrefix = (email: string) => {
    return email.split("@")[0];
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin border-4 border-solid border-[var(--color-primary)] border-r-transparent" />
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-3 py-3 sm:px-4 lg:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
              Collaboration
            </h1>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">
              Manage team members and access control
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-dark)] sm:px-4 sm:text-sm"
          >
            <Plus className={iconClass} />
            Add User
          </button>
        </div>
      </div>

      <div className="p-2 sm:p-3 lg:p-4">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase sm:text-sm">
                  Total Users
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {totalUsers}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center bg-gray-100 sm:h-12 sm:w-12">
                <svg
                  className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase sm:text-sm">
                  Active
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {activeUsers}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center bg-green-100 sm:h-12 sm:w-12">
                <svg
                  className="h-5 w-5 text-green-600 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wider text-gray-600 uppercase sm:text-sm">
                  Blocked
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {blockedUsers}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center bg-red-100 sm:h-12 sm:w-12">
                <svg
                  className="h-5 w-5 text-red-600 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    User
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Email
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Role
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Created
                  </th>
                  <th className="px-2 py-2 text-right text-xs font-semibold tracking-wider whitespace-nowrap text-gray-700 uppercase sm:px-3 sm:py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 overflow-hidden bg-gray-100 sm:h-10 sm:w-10">
                          <div className="flex h-full w-full items-center justify-center bg-[var(--color-primary-light)] text-xs font-bold text-[var(--color-primary-dark)] sm:text-sm">
                            {getEmailPrefix(user.email)[0].toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-2 min-w-0 sm:ml-3">
                          <div className="max-w-[120px] truncate text-xs font-semibold text-gray-900 sm:max-w-none sm:text-sm">
                            {getEmailPrefix(user.email)}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: #{user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                      <div className="max-w-[120px] truncate text-xs text-gray-600 sm:max-w-none sm:text-sm">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 ${getRoleColor(user.role)}`}
                      >
                        {user.role || "User"}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 ${getStatusColor(user.status)}`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-xs whitespace-nowrap text-gray-600 sm:px-3 sm:py-3 sm:text-sm">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-2 py-2 text-right whitespace-nowrap sm:px-3 sm:py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className={`${buttonClass} cursor-pointer`}>
                          <Eye className={iconClass} />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className={`${buttonClass} cursor-pointer`}
                        >
                          <Edit2 className={iconClass} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className={`${buttonClass} cursor-pointer hover:bg-red-100 hover:text-red-600`}
                        >
                          <Trash2 className={iconClass} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loading && (
            <div className="border border-gray-200 bg-white py-8 text-center sm:py-12">
              <svg
                className="mx-auto h-16 w-16 text-gray-300 sm:h-24 sm:w-24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-base font-semibold text-gray-900 sm:mt-3 sm:text-lg">
                No Users Found
              </h3>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                Get started by adding your first team member.
              </p>
              <button
                onClick={handleAddUser}
                className="mt-3 inline-flex items-center gap-2 bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-primary-dark)] sm:mt-4 sm:px-4 sm:text-sm"
              >
                <Plus className={iconClass} />
                Add User
              </button>
            </div>
          )}
        </div>
      </div>

      <NewUser
        isOpen={isNewUserModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && deleteConfirmModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-none bg-white shadow-xl">
            <div className="rounded-none p-6">
              <h3 className="mb-2 rounded-none text-lg font-semibold text-gray-900">
                Delete User
              </h3>
              <p className="mb-4 rounded-none text-sm text-gray-600">
                Are you sure you want to delete the user "
                {deleteConfirmModal.user.email}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 rounded-none">
                <button
                  onClick={handleCloseDeleteModal}
                  className="rounded-none border border-[var(--color-primary)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="rounded-none border border-transparent bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}