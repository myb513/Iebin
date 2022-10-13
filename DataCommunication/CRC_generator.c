#define _CRT_SECURE_NO_WARNINGS 
#include <stdio.h>
#include <math.h>
#include <string.h>
#include <stdlib.h>

#define G 0x18005 
#define MAX 1500 // 입출력 제한 최대값 1500byte

int zerohead(int n) //  G 비트열과의 자릿수 차를 계산
{
	if (n != 0)
		return 17 - floor(log2(n) + 1);
	else
		return 17;
}

void print_binary(unsigned n){
	for (int i = 15; i >= 0; --i) { // 16자리 까지 나타내기 위함
		int result = n >> i & 1;
		printf("%d", result);
	}
}


int main(void){

	char* input = (char*)malloc(sizeof(char) * MAX);

	scanf("%s", input);

	int n = strlen(input); // 문자열의 길이 저장


	//크기 8*n + 16인 char 배열에 ascii to 이진수 + 패리티비트를 concat해가며 삽입.

	char* data = (char*)malloc(sizeof(char) * 8 * n + 16);

	for (int i = 0; i < n; i++){
		unsigned a = 0x40;
		int check = 0;
		for (int j = 0; j < 7; j++){
			if ((a & input[i]) == a){
				data[i * 8 + j] = 1;
				check++;
			}

			else
				data[i * 8 + j] = 0;
			a >>= 1;
		}

		if (check % 2 == 1)
			data[(i + 1) * 8 - 1] = 1;
		else
			data[(i + 1) * 8 - 1] = 0;

	}

	for (int i = 0; i < 16; i++) // 데이타 비트열 뒷부분은 16개의 0으로 채움 (CRC-16)
		data[8 * n + i] = 0;
	
	
	
	int pointer = 0; // 데이타 비트열의 인덱스를 가리키는 변수
	unsigned portion = 0; // 데이타 비트열에서 XOR 연산을 할 만큼만 가져와서 저장할 부호없는 정수형 변수
	unsigned temp = 0; // XOR 연산을 해가며 CRC 값이 저장될 변수
	int start, end = 0; // portion을 가져오기 위해 필요한 시작 인덱스와 종료 인덱스
	int last;  // 마지막에 데이타비트열에서 내려올 비트(0)가 부족한 경우 레프트쉬프트 할 값을 결정
	int check = 0; //마지막에 데이타비트열에서 내려올 비트(0)가 부족한경우 1로 설정. 

	for (; end < 8 * n + 16;){
		
		portion = 0;
		start = pointer;
		end = pointer + zerohead(temp);
		
		if (end > 8 * n + 16){   //portion 연산시 가져올 마지막 인덱스는 (8*n+16)-1을 넘을 수 없음. 
			last = end - (8 * n + 16);   // 얼마 만큼 벗어났는지를 last 변수에 저장
			end = 8 * n + 16;  // malloc한 배열의 마지막 인덱스 + 1로 초기화.
			check = 1;  // 벗어남 여부
		}

		for (int i = start; i < end; i++){
			pointer += 1;
			portion += data[i];

			if (i < end - 1)
				portion <<= 1;
		}

		if (check)
			temp <<= (zerohead(temp) - last);
		
		else
		    temp <<= zerohead(temp); 

		temp |= portion;
		
		if (!check)
			temp ^= G;
	
	}

	//계산된 CRC 출력
	print_binary(temp);

	free(input); //malloc 해제
	free(data); 

	return 0;
}
