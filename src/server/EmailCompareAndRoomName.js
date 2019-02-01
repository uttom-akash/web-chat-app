const cmp = (email1, email2) => {
  console.log("cpm", email1, email2);

  let l1 = email1.length;
  let l2 = email2.length;

  if (l1 < l2) return email1 + email2;
  else if (l2 < l1) return email2 + email1;

  for (let i = 0; i < l1; i++) {
    if (email1[i] < email2[i]) return email1 + email2;
    else if (email2[i] < email1[i]) return email2 + email1;
  }
  return email1 + email2;
};

module.exports = cmp;
