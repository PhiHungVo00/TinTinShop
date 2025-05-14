export const validatePassword = (password: string) => {
  // Kiểm tra độ dài mật khẩu (ít nhất 8 ký tự)
  if (password.length < 8) {
    return { isValid: false, message: "Password phải có ít nhất 8 ký tự." };
  }
  // Kiểm tra chữ cái viết hoa (ít nhất một chữ cái viết hoa)
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password phải chứa ít nhất một chữ cái viết hoa.",
    };
  }
  // Kiểm tra chữ cái viết thường (ít nhất một chữ cái viết thường)
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password phải chứa ít nhất một chữ cái viết thường.",
    };
  }
  // Kiểm tra số (ít nhất một số)
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password phải chứa ít nhất một chữ số.",
    };
  }
  // Kiểm tra ký tự đặc biệt (ít nhất một ký tự đặc biệt)
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: "Password phải chứa ít nhất một ký tự đặc biệt.",
    };
  }

  // Nếu mật khẩu thỏa mãn tất cả các yêu cầu
  return { isValid: true, message: "Mật khẩu mạnh!" };
};
export const validateEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return { isValid: regex.test(email), message: "Email không đúng định dạng" };
};
