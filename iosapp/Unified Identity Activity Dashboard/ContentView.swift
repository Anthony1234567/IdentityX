//
//  ContentView.swift
//  Root view that controls authentication flow
//
//  Created by Anthony Martinez on 3/17/25.
//

import SwiftUI

struct ContentView: View {
    @State private var isAuthenticated = false
    @State private var loggedInUsername: String = ""

    var body: some View {
        ZStack {
            Color(.darkGray)
                .ignoresSafeArea()

            VStack(alignment: .leading) {
                if isAuthenticated {
                    HomeDashboardView(username: loggedInUsername)
                } else {
                    Text("IdentityX")
                        .font(.title2)
                        .foregroundColor(.white)
                        .bold()
                        .padding(.top, 40)
                        .padding(.leading)

                    Spacer()

                    LoginView(isAuthenticated: $isAuthenticated, loggedInUsername: $loggedInUsername)
                        .padding(.bottom, 40)
                }
            }
        }
    }
}

#Preview {
    ContentView()
}
