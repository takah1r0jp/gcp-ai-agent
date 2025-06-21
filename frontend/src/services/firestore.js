import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ユーザープロフィール管理
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return userId;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// 目標管理
export const saveGoal = async (userId, goalData) => {
  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    const docRef = await addDoc(goalsRef, {
      ...goalData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving goal:', error);
    throw error;
  }
};

export const getUserGoals = async (userId) => {
  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    const q = query(goalsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user goals:', error);
    throw error;
  }
};

export const updateGoal = async (userId, goalId, updateData) => {
  try {
    const goalRef = doc(db, 'users', userId, 'goals', goalId);
    await updateDoc(goalRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

export const deleteGoal = async (userId, goalId) => {
  try {
    const goalRef = doc(db, 'users', userId, 'goals', goalId);
    await deleteDoc(goalRef);
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
};

// プラン管理
export const savePlan = async (userId, goalId, planData) => {
  try {
    const planRef = doc(db, 'users', userId, 'goals', goalId);
    await updateDoc(planRef, {
      plan: planData,
      hasGeneratedPlan: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving plan:', error);
    throw error;
  }
};

// タスク完了状況管理
export const saveTaskProgress = async (userId, goalId, completedTasks) => {
  try {
    const goalRef = doc(db, 'users', userId, 'goals', goalId);
    await updateDoc(goalRef, {
      completedTasks: Array.from(completedTasks),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving task progress:', error);
    throw error;
  }
};

// 現在のアクティブな目標を取得
export const getCurrentGoal = async (userId) => {
  try {
    console.log('🔍 getCurrentGoal 実行 - userId:', userId);
    const goalsRef = collection(db, 'users', userId, 'goals');
    const q = query(
      goalsRef, 
      where('isActive', '==', true),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    console.log('🔍 クエリ結果 - ドキュメント数:', querySnapshot.size);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const goalData = { id: doc.id, ...doc.data() };
      console.log('🔍 取得した目標データ:', goalData);
      return goalData;
    }
    
    // アクティブな目標が見つからない場合、最新の目標を取得
    console.log('🔍 アクティブな目標が見つからないため、最新の目標を検索');
    const latestQuery = query(goalsRef, orderBy('updatedAt', 'desc'));
    const latestSnapshot = await getDocs(latestQuery);
    
    if (!latestSnapshot.empty) {
      const doc = latestSnapshot.docs[0];
      const goalData = { id: doc.id, ...doc.data() };
      console.log('🔍 最新の目標データ:', goalData);
      return goalData;
    }
    
    console.log('🔍 目標が全く見つかりません');
    return null;
  } catch (error) {
    console.error('Error getting current goal:', error);
    throw error;
  }
};

// 目標をアクティブに設定
export const setActiveGoal = async (userId, goalId) => {
  try {
    // 既存のアクティブな目標を非アクティブに
    const goalsRef = collection(db, 'users', userId, 'goals');
    const activeGoalsQuery = query(goalsRef, where('isActive', '==', true));
    const activeGoalsSnapshot = await getDocs(activeGoalsQuery);
    
    const batch = [];
    activeGoalsSnapshot.docs.forEach(doc => {
      batch.push(updateDoc(doc.ref, { 
        isActive: false, 
        updatedAt: serverTimestamp() 
      }));
    });
    
    // 新しい目標をアクティブに
    const newActiveGoalRef = doc(db, 'users', userId, 'goals', goalId);
    batch.push(updateDoc(newActiveGoalRef, { 
      isActive: true, 
      updatedAt: serverTimestamp() 
    }));
    
    await Promise.all(batch);
  } catch (error) {
    console.error('Error setting active goal:', error);
    throw error;
  }
};