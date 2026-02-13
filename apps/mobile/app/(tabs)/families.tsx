import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function Families() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Connect New Family */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            Connect with Families
          </Text>
          <Text className="text-gray-600 mb-4">
            Invite other families to coordinate playdates together.
          </Text>
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg p-3"
            onPress={() => {/* Navigate to invite flow */}}
          >
            <Text className="text-white font-semibold text-center">
              Invite a Family
            </Text>
          </TouchableOpacity>
        </View>

        {/* Connected Families */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Connected Families
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-600 text-center">
              No connected families yet. Invite some friends to get started!
            </Text>
          </View>
        </View>

        {/* Pending Invitations */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Pending Invitations
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-600 text-center">
              No pending invitations.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}