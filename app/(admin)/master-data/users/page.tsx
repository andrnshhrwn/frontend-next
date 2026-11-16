"use client";

import ChangePasswordModal from "@/components/modules/users/ChangePasswordModal";
import RolePermissionsView from "@/components/modules/users/RolePermissionsView";
import UserFilters from "@/components/modules/users/UserFilters";
import UserFormModal from "@/components/modules/users/UserFormModal";
import UserHeader from "@/components/modules/users/UserHeader";
import UserSecurityPolicy from "@/components/modules/users/UserSecurityPolicy";
import UserStats from "@/components/modules/users/UserStats";
import UserTable from "@/components/modules/users/UserTable";
import UserTabs from "@/components/modules/users/UserTabs";
import { useUser } from "@/hooks/modules/users/useUser";
import { AlertCircle } from "lucide-react";

export default function DataUserPage() {
  const {
    users,
    units,
    loading,
    refreshing,
    pageError,
    activeTab,
    roleFilter,
    unitFilter,
    search,
    editingUser,
    showCreate,
    passwordUser,
    filteredUsers,
    roleCounts,
    isAdminPusat,
    isAdminCabang,

    setActiveTab,
    setRoleFilter,
    setUnitFilter,
    setSearch,
    setEditingUser,
    setShowCreate,
    setPasswordUser,

    loadData,
    handleSaveUser,
    handleChangePassword,
    handleExport,
  } = useUser();

  const canCreateUser = isAdminPusat || isAdminCabang;

  return (
    <div className="space-y-6">
      <UserHeader
        onExport={handleExport}
        onCreate={() => setShowCreate(true)}
        exportDisabled={filteredUsers.length === 0}
        isAdminPusat={isAdminPusat}
        isAdminCabang={isAdminCabang}
      />

      <UserTabs
        activeTab={activeTab}
        totalUsers={users.length}
        refreshing={refreshing}
        isAdminPusat={isAdminPusat}
        onTabChange={setActiveTab}
        onRefresh={() => void loadData(true)}
      />

      {!loading && (
        <UserStats
          totalUsers={users.length}
          roleCounts={roleCounts}
          isAdminPusat={isAdminPusat}
          isAdminCabang={isAdminCabang}
        />
      )}

      {pageError && (
        <div className="alert alert-error text-sm">
          <AlertCircle className="h-5 w-5" />

          <div>
            <p className="font-bold">Gagal memuat data pengguna</p>
            <p className="text-xs">{pageError}</p>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            className="btn btn-sm"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {isAdminPusat && activeTab === "role" ? (
        <RolePermissionsView />
      ) : (
        <>
          <UserFilters
            units={units}
            roleFilter={roleFilter}
            unitFilter={unitFilter}
            search={search}
            isAdminPusat={isAdminPusat}
            onRoleChange={setRoleFilter}
            onUnitChange={setUnitFilter}
            onSearchChange={setSearch}
          />

          <UserTable
            users={filteredUsers}
            totalUsers={users.length}
            loading={loading}
            canManageUsers={isAdminPusat}
            onEdit={setEditingUser}
            onChangePassword={setPasswordUser}
          />
        </>
      )}

      <UserSecurityPolicy
        isAdminPusat={isAdminPusat}
        isAdminCabang={isAdminCabang}
      />

      {canCreateUser && showCreate && (
        <UserFormModal
          key="create-user"
          editing={null}
          units={units}
          onClose={() => setShowCreate(false)}
          onSave={handleSaveUser}
        />
      )}

      {isAdminPusat && editingUser && (
        <UserFormModal
          key={editingUser.id_user}
          editing={editingUser}
          units={units}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {isAdminPusat && passwordUser && (
        <ChangePasswordModal
          user={passwordUser}
          onClose={() => setPasswordUser(null)}
          onSave={handleChangePassword}
        />
      )}
    </div>
  );
}
