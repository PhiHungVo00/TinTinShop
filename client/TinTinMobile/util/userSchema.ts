import * as Yup from 'yup';

const badWordsEncoded = [
  'xJBpZHQ=',
  'w6tjw6tj',
  'bMO0bg==',
  'YnXhu7Np',
  'ZG0=',
  'xJDhu4Y=',
  'dmNs',
  'dmFzIGzDtG4=',
  'dmts',
  'dmtsw7Ru',
  'Y2jDoy==',
  'xJDEkQ==',
  'ZMOibQ==',
  'xJDhu7U=',
  'eMO0bg==',
  'xJB1',
  'ZnVjaw==',
  'c2hpdA==',
  'Yml0Y2g=',
  'YXNz',
  'xJBpZHThuqBt4bqj',
  'xJBvw6MgY2jDoy==',
  'bOG6o2UgbWF5',
  'YsOzbSBt4bqteQ==',
  'dGjDoG5nIG5ndQ==',
  'Y29uIMSRxIs=',
  'dGjDoG5nIGNow7M=',
  'Y29uIGNow7M=',
  'Y8awdA==',
];

const decodeBase64 = (encoded: string) =>
  atob(encoded);


const badWords = badWordsEncoded.map(decodeBase64);


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
