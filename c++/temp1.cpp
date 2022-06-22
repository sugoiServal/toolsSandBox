int return_ref_plus_1(int &in_float) {
  return in_float++;
}
int return_ref(const int &in_float) {
  return in_float;
}

int num =1;
int &ref_num = num;       // read-write
const int kRef_num = num; // read only
num = 2;        // num_ref also become 2
ref_num = 3;    // as an alias, num_ref uses like normal variable

int num2 = return_ref_plus_1(ref_num);   // save the need to copy num into the function scope

num2 = return_ref(kRef_num)