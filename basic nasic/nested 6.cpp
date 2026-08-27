#include <iostream>
using namespace std;
int main()
{
    int i,j,k;
    cout<<"Enter the number of rows you want ";
    cin>>k;
    for(i=k;i>0;i--)
    {
        for(j=1;j<i;j++)
        {
            cout<<" ";
        }
        for(j=k-i;j>0;j--)
        {
            cout<<"*";
        }
        cout<<endl;
    }

}