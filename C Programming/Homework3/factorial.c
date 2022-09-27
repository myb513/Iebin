#include <stdio.h>
#define _CRT_SECURE_NO_WARNINGS

int main(void){
	int num;
	int fac = 1;
	printf("수를 입력하세요. : ");
	scanf_s("%d", &num);
	int temp = num;

	for (; temp - 1;){
			fac *= temp; 
			temp -= 1;
		}
		printf("\n%d!은 %d입니다.\n",num, fac);

	return 0;
}
