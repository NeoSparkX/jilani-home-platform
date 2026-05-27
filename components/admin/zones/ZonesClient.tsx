"use client";

import React from "react";
import ZonesTable from "./ZonesTable";
import ZoneFormModal from "./ZoneFormModal";

export default function ZonesClient() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ZoneFormModal />
      </div>
      <ZonesTable />
    </div>
  );
}
