// Debug utilities for troubleshooting localStorage issues

// Clear all localStorage data
export const clearAllData = () => {
  try {
    localStorage.clear();
    console.log('All localStorage data cleared');
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
};

// Check localStorage status
export const checkLocalStorageStatus = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    
    const users = localStorage.getItem('users');
    const currentUser = localStorage.getItem('currentUser');
    
    console.log('localStorage Status:', {
      available: true,
      users: users ? JSON.parse(users) : null,
      currentUser: currentUser ? JSON.parse(currentUser) : null,
      totalKeys: localStorage.length
    });
    
    return true;
  } catch (error) {
    console.error('localStorage Status:', {
      available: false,
      error: error.message
    });
    return false;
  }
};

// Reset system data
export const resetSystemData = () => {
  try {
    localStorage.removeItem('users');
    localStorage.removeItem('currentUser');
    console.log('System data reset');
    return true;
  } catch (error) {
    console.error('Failed to reset system data:', error);
    return false;
  }
};

// Make functions available globally for console debugging
if (typeof window !== 'undefined') {
  window.debugAuth = {
    clearAllData,
    checkLocalStorageStatus,
    resetSystemData
  };
  console.log('Debug utilities available at window.debugAuth');
}
