#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAX 1000

int bit_1_count(int n){
	int count = 0;
	while (n){
		count += n % 2;
		n /= 2;
	}
	return count;
}

void print_1s_complement(unsigned n){
		for (int i = 15; i >= 0; --i) { // 16자리 까지 나타내기 위함
		int result = n >> i & 1;
		printf("%d", !result); 
	}
}

//메인문
int main(){

	char *input = malloc(sizeof(char) * MAX);

	scanf("%s", input);

	int n = strlen(input);

	unsigned * values = malloc(sizeof(unsigned)* n);


	for (int i = 0; i < n; i++){
		values[i] = (unsigned)input[i];
	}

	
	for (int i = 0; i < n; i++){
		

		if (bit_1_count(values[i]) % 2 == 1)
		{
			values[i] <<= 1;
			values[i] += 1;
		} 
		else
			values[i] <<= 1;
	}

	if (n % 2 == 0){
		int i = 0;
		while (i < n){
			values[i] <<= 8;
			values[i] |= values[i + 1];
			
			i += 2;
		}
	}
	else{
		int j = 0;
		while (j < n){
			values[j] <<= 8;
			if (j != n - 1)
				values[j] |= values[j + 1]; 
		
			j += 2;
		}
	}
	
	unsigned sum = 0;

	int k = 0;
	while (k < n){
		sum += values[k];
		k += 2;
	}

	for (;sum >> 16;){ //윤회식 자리올림
		sum = (sum & 0xFFFF) + (sum >> 16);
	}

	print_1s_complement(sum); // 1의 보수 출력
	
	free(input);
	free(values);

	return 0;
}
