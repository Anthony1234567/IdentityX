//
//  HomeDashboardView.swift
//  Displays the user dashboard after successful login
//

import SwiftUI

struct HomeDashboardView: View {
    var username: String
    @State private var items: [DashboardItem] = []

    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Recent Logins")) {
                    ForEach(items.filter { $0.type == "Recent Login" }) { item in
                        NavigationLink(destination: DeviceDetailView(item: item)) {
                            Text("\(item.name) - \(item.status)")
                        }
                    }
                }

                Section(header: Text("Active Sessions")) {
                    ForEach(items.filter { $0.type == "Active Session" }) { item in
                        NavigationLink(destination: DeviceDetailView(item: item)) {
                            Text("\(item.name) - \(item.status)")
                        }
                    }
                }
            }
            .listStyle(GroupedListStyle())
            .navigationTitle("Welcome, \(username)!")
            .onAppear {
                loadDashboardItems()
            }
        }
    }

    private func loadDashboardItems() {
        if let url = Bundle.main.url(forResource: "dashboard_items", withExtension: "json"),
           let data = try? Data(contentsOf: url),
           let decoded = try? JSONDecoder().decode([DashboardItem].self, from: data) {
            items = decoded
        }
    }
}

#Preview {
    HomeDashboardView(username: "Anthony Martinez")
}
