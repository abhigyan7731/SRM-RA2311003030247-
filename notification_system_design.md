# Stage 1

Goal: implement a Priority Inbox that returns top-n unread notifications using weight and recency.

Approach
- Assign weights: placement = 3, result = 2, event = 1.
- For each notification compute score = weight * W + recencyScore
  - recencyScore = secondsSince(timestamp) scaled (e.g. 1e-3) so recent items rank higher.
- Use a min-heap (priority queue) of size n to maintain top-n as notifications stream in.

Algorithm (simple implementation)
- Fetch notifications from the API.
- For each notification:
  - parse timestamp, compute age in seconds
  - compute score = weight*100000 - age
  - push into min-heap; if heap size > n, pop smallest
- At the end, heap contains top-n by score; sort descending for display.

Complexity
- Building top-n with heap: O(m log n) where m = total notifications, n = top size.

Notes
- This design keeps memory bounded (heap of size n) and supports continuous updates by inserting new items and removing lowest when size exceeds n.
