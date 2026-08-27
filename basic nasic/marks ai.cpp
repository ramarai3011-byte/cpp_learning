#include <iostream>
using namespace std;

// Function declaration
float cal(int a, int b, int c, int d, int e);

int main()
{
    int m, p, c, e, o;
    float pcm, t;

    cout << "Welcome!\n";

    cout << "Enter Mathematics marks: ";
    cin >> m;

    cout << "Enter Physics marks: ";
    cin >> p;

    cout << "Enter Chemistry marks: ";
    cin >> c;

    cout << "Enter Language marks: ";
    cin >> e;

    cout << "Enter Optional Subject marks: ";
    cin >> o;

    pcm = (p + c + m) / 3.0;
    t = cal(m, p, c, e, o);

    if (m >= 60 && p >= 60 && c >= 60 && pcm >= 70 && t >= 75)
    {
        cout << "\nYou are eligible for JEE." << endl;
        cout << "Your total percentage is: " << t << "%";
    }
    else
    {
        cout << "\nYou are not eligible for JEE." << endl;

        if (m < 60)
            cout << "Mathematics marks are below 60.\n";

        if (p < 60)
            cout << "Physics marks are below 60.\n";

        if (c < 60)
            cout << "Chemistry marks are below 60.\n";

        if (pcm < 70)
            cout << "PCM average is below 70.\n";

        if (t < 75)
            cout << "Overall percentage is below 75.\n";
    }

    return 0;
}

// Function definition
float cal(int a, int b, int c, int d, int e)
{
    return (a + b + c + d + e) / 5.0;
}