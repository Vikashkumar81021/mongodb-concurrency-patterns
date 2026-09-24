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
