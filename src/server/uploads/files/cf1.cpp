#include <bits/stdc++.h>

#define mx 1000
#define mod 1000007
#define ll long long

using namespace std;

int main(int argc, char const *argv[])
{
    ios::sync_with_stdio(false);

    int n, m;
    ll ans = 0;
    cin >> n >> m;
    int x[m + 5], subt[m + 5];

    for (int i = 0; i < m; i++)
        cin >> x[i];

    sort(x, x + m);

    for (int i = 1; i < m; i++)
        subt[i - 1] = x[i] - x[i - 1], ans += (ll)subt[i - 1];
    m--;
    sort(subt, subt + m, greater<int>());
    for (int i = 0; i < n - 1 && m; i++)
        ans -= subt[i], m--;
    cout << ans << "\n";
    return 0;
}