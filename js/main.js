// 页面加载完执行
document.addEventListener('DOMContentLoaded', function () {

  // 🔴全局登录校验（所有页面都会执行）
  checkLogin();


  // 🟢 导航菜单点击跳转
  const items = document.querySelectorAll('.navbar div');
  if (items.length > 0) {
    items.forEach(item => {
      item.addEventListener('click', function () {
        const page = this.getAttribute('data-page');
        switch (page) {
          case 'index':
            location.href = 'index.html';
            break;
          case 'news':
            location.href = 'news.html';
            break;
          case 'about':
            location.href = 'about.html';
            break;
          case 'profile':
            location.href = 'profile.html';
            break;
        }
      });
    });
  }

    // 🟣 个人中心侧边栏切换逻辑（新增）
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const panels = document.querySelectorAll('.panel');
  if (sidebarItems.length > 0 && panels.length > 0) {
    sidebarItems.forEach(item => {
      item.addEventListener('click', function () {
        // 1. 移除所有菜单的激活态
        sidebarItems.forEach(i => i.classList.remove('active'));
        // 2. 给当前点击的菜单加激活态
        this.classList.add('active');
        // 3. 获取要显示的面板id
        const targetPanel = this.getAttribute('data-panel');
        // 4. 隐藏所有面板
        panels.forEach(panel => panel.classList.remove('active'));
        // 5. 显示目标面板
        document.getElementById(`panel-${targetPanel}`).classList.add('active');
      });
    });
  }

  // 🔵 登录按钮逻辑
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', function () {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();





      // 👇 原来你是写死判断
    // if (username === 'admin' && password === '123456') {
    //     // 1. 先记录登录状态
    //     localStorage.setItem('isLogin', 'true');
    //     // 2. 弹窗提示
    //     alert('登录成功！');
    //     // 3. 弹窗关闭后，自动跳转到首页
    //     location.href = 'index.html';
    // } else {
    // alert('账号或密码错误！\n正确：admin / 123456');
    // }




    // if (username === 'admin' && password === '123456') {
    // localStorage.setItem('isLogin', 'true');
    // // 用setTimeout模拟自动关闭的提示，300ms后跳转
    // alert('登录成功！');
    // setTimeout(() => {
    //     location.href = 'index.html';
    // }, 300);
    // }



    if (username === 'admin' && password === '123456') {
    localStorage.setItem('isLogin', 'true');
    // 显示提示（不阻塞！）
    const toast = document.getElementById('toast');
    toast.innerText = '登录成功！正在进入首页...';
    toast.style.display = 'block';
    // 1.5秒后自动跳首页，完全不用点弹窗！
    setTimeout(() => {
        location.href = 'index.html';
    }, 500);
    } else {
    const toast = document.getElementById('toast');
    toast.innerText = '账号或密码错误！';
    toast.style.background = '#ff4d4f';
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
    }




    // 真正发请求给 SpringBoot 后端
    // ==============================
    //   axios.post('http://localhost:8080/api/login', {
    //     username: username,
    //     password: password
    //   })
    //   .then(res => {
    //     // ==============================
    //     // res = 后端返回的响应
    //     // res.data = 后端的 JSON 数据
    //     // ==============================
    //     if (res.data.success) {
    //       alert('登录成功！');
    //       // 保存登录状态
    //       localStorage.setItem('isLogin', 'true');
    //       // 跳首页
    //       location.href = 'index.html';
    //     } else {
    //       alert('登录失败：' + res.data.msg);
    //     }
    //   })
    //   .catch(err => {
    //     alert('服务器异常，请稍后再试！');
    //     console.error(err);
    //   });





    });
  }






  //✅ 登录校验函数（统一在这里控制）
  function checkLogin() {
    const isLogin = localStorage.getItem('isLogin');
    const currentPage = location.pathname;//只有当前不在登录页，才跳转登录页，已经在登录页了，就不跳了！


    // 如果没登录，并且不是登录页 → 跳登录
    if (!isLogin && !currentPage.includes('login.html')) {
      location.href = 'login.html';
    }
  }


    document.getElementById('logoutBtn').addEventListener('click', function() {
    // 1. 清除登录状态
    localStorage.removeItem('isLogin');
    // 2. 跳转到登录页
    window.location.href = 'login.html';
    });

});