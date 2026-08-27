#include <iostream>
#include <string>
using namespace std;
int main()
{
    int i,j,k;
    cout<<"enter the number of rows you want"<<endl;
    cin>>k;
    for(i=k;i>=1;i--)
    {
        for(j=1;j<=i;j++)
        {
            cout<<"*";
        }
        cout<<endl;
    }

}