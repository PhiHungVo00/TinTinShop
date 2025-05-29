import * as Yup from 'yup';

const badWords = [ 'địt',
    'cặc',
    'lồn',
    'buồi',
    'dm',
    'đm',
    'vcl',
    'vãi lồn',
    'vkl',
    'vklồn',
    'chó',
    'đĩ',
    'dâm',
    'đú',
    'xồn',
    'đụ',
    'fuck',
    'shit',
    'bitch',
    'ass',
    'địt mẹ',
    'đồ chó',
    'mẹ mày',
    'bố mày',
    'thằng ngu',
    'con đĩ',
    'thằng chó',
    'con chó',
    'cút',];

const isProfanityFree = (value: string) => {
  const lower = value.toLowerCase();
  return !badWords.some((word) => lower.includes(word));
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
// Ý nghĩa:
// - Tối thiểu 8 ký tự
// - Ít nhất 1 chữ hoa
// - Ít nhất 1 chữ thường
// - Ít nhất 1 số
// - Ít nhất 1 ký tự đặc biệt

const userSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên không được để trống')
    .min(3, 'Tên phải có ít nhất 3 ký tự')
    .test('no-bad-words', 'Tên chứa từ ngữ không phù hợp', isProfanityFree),

  email: Yup.string()
    .required('Email không được để trống')
    .email('Email không hợp lệ'),

  password: Yup.string()
    .required('Mật khẩu không được để trống')
    .matches(
      passwordRegex,
      'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
    ),
    phone: Yup.string()
    .matches(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
});

export default userSchema;
