#include<stdio.h>
#include<math.h>

void main(){
    float a,b,c,m;
    
    
    
    printf("enter a,b,c:\n");
    scanf("%f %f %f", &a, &b, &c);
    m = (-a)/b;
    printf("slope:%f", m);
    
    if ( b==0){
        printf("it is virtical");
    
    }
    else {
        printf("not virtical");
    }
    
}