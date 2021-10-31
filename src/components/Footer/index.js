import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Footer = ({ page }) => {
  return (
    <>
      <footer className={`footer ${page === 'CART' ? 'bg-gray-100' : ''} relative bottom-0 left-0 mt-40 font-robo`}>
        <div className='w-full flex flex-col justify-center bg-gradient-to-tr from-brand to-white items-center py-3'>
          <Link to='/'>
            <img src={logo} alt='' className='w-28' />
          </Link>
          <p className='font-montse font-bold text-xl text-brand-dark'>GOOD CHOICE GOOD FASHION</p>
          <div className='flex flex-col justify-center items-center mt-7'>
            <p className='cursor-pointer'>Giới thiệu về GUT</p>
            <p className='cursor-pointer'>Tuyển dụng</p>
            <p>.</p>
            <p className='cursor-pointer'>Quy chế hoạt động</p>
            <p className='cursor-pointer'>Điều khoản mua bán</p>
            <p>.</p>
            <p className='cursor-pointer'>Mã Voucher giảm giá</p>
            <div className='mt-7 text-center'>
              <p>Đặt hàng và thu tiền tận nơi toàn quốc</p>
              <p className='font-bold text-xl'>(09) 7715 8941</p>
            </div>
            <div className='mt-5 text-center'>
              <p className='font-bold text-xl'>CSKH</p>
              <div className='mt-1'>
                <a href='/' className='no-underline text-black'>
                  Than phiền/Chăm sóc khách hàng
                </a>
              </div>
            </div>
            <div className='mt-5 text-center'>
              <p className='font-bold text-xl'>FAQ</p>
              <div className='mt-1'>
                <p className='cursor-pointer'>Vận chuyển</p>
                <p className='cursor-pointer'>Chính sách đổi trả</p>
                <p className='cursor-pointer'>Chính sách bảo hành</p>
                <p className='cursor-pointer'>Khách hàng VIP</p>
                <p className='cursor-pointer'>Đối tác cung cấp</p>
              </div>
            </div>
          </div>
          <div className='flex justify-between mt-10 pt-5 border-t border-brand w-full px-5'>
            <div>
              <p>© 2021 - CÔNG TY TNHH GUT VN</p>
              <p style={{ fontSize: '9px' }}>
                Giấy CNĐKDN: 0310874914 – Ngày cấp: 25/11/2011 - Cơ quan cấp: Phòng Đăng Ký Kinh Doanh – Sở Kế Hoạch và
                Đầu Tư TP.HCM
                <br />
                Địa chỉ đăng ký kinh doanh: 766/3B-3C Sư Vạn Hạnh (Nối dài), Phường 12, Quận 10, TP.HCM - Điện thoại:
                028 3868 4857 - Email: cskh@GUT.vn
              </p>
            </div>
            <img src='https://res.yame.vn/dathongbao.png' alt='' className='h-8' />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
