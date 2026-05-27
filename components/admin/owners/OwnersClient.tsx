"use client";

import React from "react";
import OwnersTable from "./OwnersTable";
import OwnerFormModal from "./OwnerFormModal";

export default function OwnersClient() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <OwnerFormModal />
      </div>
      <OwnersTable />
    </div>
  );
}
