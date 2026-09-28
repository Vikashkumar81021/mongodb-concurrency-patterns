Atomic Update vs Optimistic Locking

Database Concurrency Approaches

# Database Concurrency Approaches

| Situation                                                                            | Common Approach         |
| ------------------------------------------------------------------------------------ | ----------------------- |
| Ek document par simple conditional update                                            | **Atomic Update**       |
| Same document ko multiple requests edit karti hain aur stale update detect karna hai | **Optimistic Locking**  |
| Multiple related DB operations ko all-or-nothing rakhna hai                          | **Transaction**         |
| Resource ko explicitly lock karke doosron ko wait karwana hai                        | **Pessimistic Locking** |

Atomic update:

"Condition match karti hai to update karo."
Optimistic locking:

"Maine jo version read kiya tha, agar woh abhi bhi same hai tabhi update karo."
Transaction:

"Ye saare related operations ya to sab successful honge, ya sab rollback honge."
Atomic Update:

"Mujhe ek specific condition ke basis par ek update safely karna hai."

Optimistic Locking:

"Maine document read kiya tha. Ab mujhe ensure karna hai ki mere read karne ke baad kisi aur ne us document ko change nahi kiya."

Pessimistic Locking
Pessimistic locking mein Request B ko wait karna padega jab tak Request A lock release nahi karti.

Offset pagination ki 2 major problems:

Large skip() → performance issue
Data change hone par page boundaries shift ho sakti hain → duplicate/missing records ka risk

page batata hai kaunsa page chahiye, limit batata hai kitne records chahiye, aur skip batata hai kitne records pehle chhodne hain.

#ISSUE WITH OFFSET PAGINATION
#Problem 1: skip bada hone par query slow ho sakti hai

Maan lo 50 lakh products hain.

User page 1 par:

skip(0).limit(20)

Easy — 20 products.

Lekin user bahut aage chala gaya:

skip(2000000).limit(20)

Database ko large offset tak traverse karna pad sakta hai, phir next 20 records dene hain.

P1 P2 P3 ... P20,00,000 → SKIP
↓
next 20 → RETURN

Isliye large offset par performance degrade ho sakti hai.

#Problem 2: Data change hone par records duplicate/missing ho sakte hain
Isi problem ko solve karne ke liye cursor-based pagination use hoti hai.
