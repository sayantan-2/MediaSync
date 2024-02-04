#include<stdio.h>

float sqarea(float side);
float crarea(float red);
float rectarea(float l, float b);

int main(){
    char c;
    char s;
    char o;
    char r;
    printf("what do you wanna do (enter s,c,r)- ");
    scanf("%c",&o);
    if (o==s){
        int side;
        printf("Enter side");
        scanf("%f",&side);
        printf("the area is -%f", sqarea(side));
    }else if (o==c){
        int red;
        printf("Enter radious");
        scanf("%f",&red);
        printf("the area is -%f", crarea(red));
        
    }else{
        float l;
        float b;
        printf("enter length-");
        scanf("%f",&l);
        printf("enter breath-");
        scanf("%f",&b);
        printf("the area of rectangle is-%f", rectarea(l,b));

    }
    return 0;
}
float sqarea(float side){
    return side*side;
}
float crarea(float red){
    return (3.14*red*red);
}
float rectarea(float l, float b){
    return l*b;
}