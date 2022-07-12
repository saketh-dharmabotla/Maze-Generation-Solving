export class Queue {

    constructor() {
      this.first = 0;
      this.last = 0;
      this.storage = {};
    }
  
    enqueue(value) {
      this.storage[this.last] = value;
      this.last++;
    }
  
    dequeue() {
      if (this.last > this.first) {
        var value = this.storage[this.first];
        this.first++;
        return value;
      } else {
        return 0;
      }
    }

    front() {
        return this.storage[this.first];
    }
  
    size() {
      return this.last - this.first;
    }
  
  }

export class MinHeap {

    constructor (type) {
        this.heap = [null] 
        this.choice = type 
        this.size = 0;
    }

    getSize() {
        return this.size;
    }

    getMin () {
        return this.heap[1]
    }

    compare(node1, node2) {
        if(this.choice == 0) {return this.compMan(node1, node2);}
        
        return this.compHam(node1, node2);
    }

    compMan(node1, node2) {
        return node1.manhattan > node2.manhattan;
    }
    
    compHam(node1, node2) {
        return node1.hamming > node2.hamming;
    }

    insert (node) {

        this.heap.push(node)
        this.size++;

        if (this.heap.length > 1) {
            let current = this.heap.length - 1

            while (current > 1 && this.compare(this.heap[Math.floor(current/2)], this.heap[current])) {

                [this.heap[Math.floor(current/2)], this.heap[current]] = [this.heap[current], this.heap[Math.floor(current/2)]]
                current = Math.floor(current/2)
            }
        }
    }
    
    remove() {
        
        if(this.size >= 1) {this.size--;}
        
        let smallest = this.heap[1]

        if (this.heap.length > 2) {
            this.heap[1] = this.heap[this.heap.length-1]
            this.heap.splice(this.heap.length - 1)

            if (this.heap.length === 3) {
                if (this.compare(this.heap[1], this.heap[2])) {
                    [this.heap[1], this.heap[2]] = [this.heap[2], this.heap[1]]
                }
                return smallest
            }

            let current = 1
            let leftChildIndex = current * 2
            let rightChildIndex = current * 2 + 1

            while (this.heap[leftChildIndex] &&
                    this.heap[rightChildIndex] &&
                    (this.compare(this.heap[current], this.heap[leftChildIndex]) ||
                        this.compare(this.heap[current], this.heap[rightChildIndex]))) {
                if (this.compare(this.heap[rightChildIndex], this.heap[leftChildIndex])) {
                    [this.heap[current], this.heap[leftChildIndex]] = [this.heap[leftChildIndex], this.heap[current]]
                    current = leftChildIndex
                } else {
                    [this.heap[current], this.heap[rightChildIndex]] = [this.heap[rightChildIndex], this.heap[current]]
                    current = rightChildIndex
                }

                leftChildIndex = current * 2
                rightChildIndex = current * 2 + 1
            }
        }

        else if (this.heap.length === 2) {
            this.heap.splice(1, 1)
        } else {
            return null
        }

        return smallest
    }
}
 
export class DisjointSets {
    constructor() {

    }
}