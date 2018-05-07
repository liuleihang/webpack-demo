console.log('this is  webpack index');
import '../css/style.css';
if (module.hot) {
    // 实现热更新
    module.hot.accept();
}