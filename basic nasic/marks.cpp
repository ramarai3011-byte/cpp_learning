#include <iostream>
using namespace std;
int cal(int a,int b,int c,int d,int e);
int main()
{
    int m,p,c,e,o;
    float pcm,t;
    cout<<"Welcome my nih,"<<endl<<"Enter Mathmatics marks :";
    cin>>m;
    cout<<endl<<"Enter Physics marks :";
    cin>>p;
    cout<<endl<<"Enter Chemistry marks :";
    cin>>c;
    cout<<endl<<"Enter Language marks :";
    cin>>e;
    cout<<endl<<"Enter optional subject marks :";
    cin>>o;
    pcm=(p+c+m)/3;
    t=cal(m,p,c,e,o);
    if(m>=60&&p>=60&&c>=60&&pcm>=70&&t>=75)
    {
        cout<<"You are eligible for jee "<<endl<<"Your total percentage is: "<<t;
    }
    else 
    {
        cout<<"lol";
    }

}
int cal(int a,int b,int c,int d,int e)
{
    return (a+b+c+d+e)/5;
}