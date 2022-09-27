#include <stdio.h>
#pragma warning(disable:4996)
int main(void)
{
	int sec;
	printf("초(second) 입력: ");
	scanf("%d", &sec);
	int h, m, s;
	h = sec / 3600;
	m = sec % 3600 / 60;
	s = sec % 60;
	printf("h: %d, m: %d, s: %d", h, m, s);
	return 0;
}
