#include <stdio.h>
int main(void){

	char value[2] = { 'F', 'T' };

	printf("1)\n");

	for (int i = 1; i > -1; i--){

		for (int j = 1; j > -1; j--){
			int boolean = (i & j) & (!(i | j));

			if (boolean == 1){
				printf("%c %c ", value[i], value[j]);
				printf(" T\n");
			}
			else{
				printf("%c %c ", value[i], value[j]);
				printf(" F\n");
			}
		}
		
	}

	printf("\n2)\n");

	for (int p = 1; p > -1; p--){

		for (int q = 1; q > -1; q--){

			for (int r = 1; r > -1; r--){
				int result = ((!p) | r)&((!q) | r);

				if (result == 1){
					printf("%c %c %c ", value[p], value[q], value[r]);
					printf(" T\n");
				}
				else{
					printf("%c %c %c ", value[p], value[q], value[r]);
					printf(" F\n");
				}
			}
		}
	}

	return 0;
}
