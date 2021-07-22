const ERRORS = {
  ERR_LOGIN_FAIL: 'Your registed email address and password do not match. Please check and enter again.',
  ERR_USER_CREATED_FAIL: "We're sorry, but something went wrong. Please try again.",
  ERR_EMAIL_NOT_BLANK: 'Please enter your email address.',
  ERR_EMAIL_INVALID: 'Please enter your email address correctly.',
  ERR_PASSWORD_NOT_BLANK: 'Please enter your password.',
  ERR_EMAIL_ALREADY_TAKEN: 'Email is already taken.',
  ERR_PASSWORD_SIZE: 'Password must be at least 6 charaters long and no more than 20 characters long.',
  ERR_FIRSTNAME_NOT_BLANK: 'Please enter your first name.',
  ERR_FIRSTNAME_SIZE: 'First name must be no more than 50 characters long.',
  ERR_LASTNAME_NOT_BLANK: 'Please enter your last name.',
  ERR_LASTNAME_SIZE: 'Last name must be no more than 50 characters long',
  ERR_PASSWORD_NOT_MATCH: 'Passwords do not match.',
  ERR_TERMS_AND_CONDITION_NOT_CHECK: 'Please check to accept Terms and Conditions.',
  ERR_CATEGORY_PARENT_NOT_FOUND: 'Category parent {} is not found.',
  ERR_CATEGORY_NOT_FOUND: 'Category {} is not found.',
  ERR_CATEGORY_DELETED_FAIL: 'Fail to delete category {}. Please try again.',
  ERR_CATEGORY_STILL_IN_PARENT:
    'There are some categories still owned by {}. Please delete all of them before delete {}.',
  ERR_CATEGORY_PARENT_DELETED_FAIL: 'Fail to delete category parent {}. Please try again.',
};

export default ERRORS;
