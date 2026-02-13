import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function Availability() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Quick Add */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            Set Availability
          </Text>
          <Text className="text-gray-600 mb-4">
            Let other families know when your children are free for playdates.
          </Text>
          <TouchableOpacity 
            className="bg-green-600 rounded-lg p-3"
            onPress={() => {/* Navigate to add availability */}}
          >
            <Text className="text-white font-semibold text-center">
              Add Availability
            </Text>
          </TouchableOpacity>
        </View>

        {/* Current Availability */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Current Availability
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-600 text-center">
              No availability windows set yet. Add some to start matching with other families!
            </Text>
          </View>
        </View>

        {/* Children */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Your Children
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-600 text-center mb-4">
              Add your children to set their individual availability.
            </Text>
            <TouchableOpacity 
              className="bg-purple-600 rounded-lg p-3"
              onPress={() => {/* Navigate to add child */}}
            >
              <Text className="text-white font-semibold text-center">
                Add a Child
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Matches */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Availability Matches
          </Text>
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-600 text-center">
              No matches found. Set your availability to see potential playdates!
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}