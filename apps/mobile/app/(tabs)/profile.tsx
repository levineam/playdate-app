import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createSupabaseClient, authHelpers } from '@playdate/supabase';

// TODO: Move to environment variables
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';

export default function Profile() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      await authHelpers.signOut(supabase);
      router.replace('/(auth)');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
      console.error('Sign out error:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Family Profile */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <Text className="text-xl font-bold text-gray-900 mb-2">
            Family Profile
          </Text>
          <Text className="text-gray-600 mb-4">
            Manage your family information and preferences.
          </Text>
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg p-3 mb-3"
            onPress={() => {/* Navigate to edit family profile */}}
          >
            <Text className="text-white font-semibold text-center">
              Edit Family Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-green-600 rounded-lg p-3"
            onPress={() => {/* Navigate to manage children */}}
          >
            <Text className="text-white font-semibold text-center">
              Manage Children
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Settings
          </Text>
          <View className="space-y-3">
            <TouchableOpacity 
              className="py-3 border-b border-gray-200"
              onPress={() => {/* Navigate to notification settings */}}
            >
              <Text className="text-gray-700 font-medium">
                Notification Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="py-3 border-b border-gray-200"
              onPress={() => {/* Navigate to privacy settings */}}
            >
              <Text className="text-gray-700 font-medium">
                Privacy Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="py-3"
              onPress={() => {/* Navigate to help/support */}}
            >
              <Text className="text-gray-700 font-medium">
                Help & Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <TouchableOpacity 
            className="bg-red-600 rounded-lg p-3"
            onPress={handleSignOut}
          >
            <Text className="text-white font-semibold text-center">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}