//
//  DeviceDetailView.swift
//  Displays metadata about a dashboard item
//

import SwiftUI

struct DeviceDetailView: View {
    let item: DashboardItem

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(item.name)
                .font(.largeTitle)
                .bold()

            Text("Status: \(item.status)")
                .font(.title2)

            if let location = item.location {
                Text("Location: \(location)")
            }

            if let timestamp = item.timestamp {
                Text("Last Seen: \(formattedDate(from: timestamp))")
            }

            if let notes = item.notes {
                Text("Notes: \(notes)")
                    .padding(.top)
            }

            Spacer()
        }
        .padding()
        .navigationTitle("Details")
    }

    private func formattedDate(from iso: String) -> String {
        let formatter = ISO8601DateFormatter()
        if let date = formatter.date(from: iso) {
            let displayFormatter = DateFormatter()
            displayFormatter.dateStyle = .medium
            displayFormatter.timeStyle = .short
            return displayFormatter.string(from: date)
        }
        return iso
    }
}

#Preview {
    DeviceDetailView(item: DashboardItem(
        id: UUID(),
        type: "Recent Login",
        name: "MacBook Pro",
        status: "Safe",
        location: "San Francisco, CA",
        timestamp: "2025-03-23T15:00:00Z",
        notes: "Trusted network detected."
    ))
}
