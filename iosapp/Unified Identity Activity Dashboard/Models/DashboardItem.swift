//
//  DashboardItem.swift
//  Model representing dashboard entries
//

import Foundation

struct DashboardItem: Identifiable, Codable {
    let id: UUID
    let type: String           // e.g. "Recent Login", "Active Session"
    let name: String           // e.g. "MacBook Pro"
    let status: String         // e.g. "Safe"
    let location: String?      // Optional: "San Francisco, CA"
    let timestamp: String?     // Optional: "2025-03-23T15:00:00Z"
    let notes: String?         // Optional notes or metadata
}
