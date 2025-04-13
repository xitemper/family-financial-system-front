// import axios from "axios";

// let userPermissions = new Set(); // 缓存在内存中

// export async function loadUserPermissions(userId) {
//   const resp = await axios.get(`/api/permission/getUserAllPermission?userId=${userId}`);
//   const perms = resp.data.content || [];
//   userPermissions = new Set(perms.map(p => p.code));
// }

// export function hasPermission(code) {
//   return userPermissions.has(code);
// }

// permission.js
import axios from "axios";

let userPermissions = new Set(); // 缓存到内存

// 从后端加载用户权限，并缓存到内存 + localStorage
export async function loadUserPermissions(userId) {
  try {
    const resp = await axios.get(`/api/permission/getUserAllPermission?userId=${userId}`);
    const perms = resp.data.content || [];

    userPermissions = new Set(perms.map(p => p.code));

    // 缓存到 localStorage
    localStorage.setItem("userPermissions", JSON.stringify(Array.from(userPermissions)));
  } catch (error) {
    console.error("加载权限失败:", error);
  }
}

// 从 localStorage 加载权限到内存（刷新后）
function loadPermissionsFromLocalStorage() {
  const cached = localStorage.getItem("userPermissions");
  if (cached) {
    try {
      const permsArray = JSON.parse(cached);
      userPermissions = new Set(permsArray);
    } catch (e) {
      console.error("解析权限缓存失败:", e);
      userPermissions = new Set();
    }
  }
}

// 在页面初始化时尝试加载缓存权限
loadPermissionsFromLocalStorage();

// 提供权限判断方法
export function hasPermission(code) {
  return userPermissions.has(code);
}
