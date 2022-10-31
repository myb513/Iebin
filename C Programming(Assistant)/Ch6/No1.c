#include <stdio.h>
#pragma warning(disable:4996)
struct STUDENTS {
	int num;
	int kor;
	int math;
} students[10];
int main(void)
{
	int cnt = 0;
	while (1)
	{
		printf("\n1.입력, 2.전체정보출력, 3.국어점수평균, 4.수학점수평균, 5.종료\n");
		int n;
		scanf("%d", &n);
		if (n == 1)
		{
			printf("아래의 내용을 차례로 입력하세요.\n학번 국어점수 수학점수\n");
			scanf("%d %d %d", &students[cnt].num, &students[cnt].kor, &students[cnt].math);
			cnt++;
		}
		else if (n == 2)
		{
			for (int i = 0; i < cnt; i++)
			{
				printf("학번: %d, 국어점수: %d, 수학점수: %d\n", students[i].num, students[i].kor, students[i].math);
			}
		}
		else if (n == 3)
		{
			double tot = 0;
			for (int i = 0; i < cnt; i++) tot += (double)students[i].kor;
			printf("국어 평균은 %lf입니다.\n", tot / (double)cnt);
		}
		else if (n == 4)
		{
			double tot = 0;
			for (int i = 0; i < cnt; i++) tot += (double)students[i].math;
			printf("수학 평균은 %lf입니다.\n", tot / (double)cnt);
		}
		else break;
	}
	return 0;
}
