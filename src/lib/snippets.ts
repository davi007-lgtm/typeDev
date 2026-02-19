export interface Snippet {
    id: string;
    language: string;
    code: string;
    description: string;
}

export const SNIPPETS: Snippet[] = [
    {
        id: 'js-1',
        language: 'javascript',
        description: 'Basic function declaration',
        code: `function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(10, 20);
console.log(result);`
    },
    {
        id: 'js-2',
        language: 'javascript',
        description: 'Async await example',
        code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching:", error);
  }
}`
    },
    {
        id: 'py-1',
        language: 'python',
        description: 'Simple class definition',
        code: `class Developer:
    def __init__(self, name, language):
        self.name = name
        self.language = language

    def greet(self):
        print(f"I am {self.name}, I code in {self.language}")`
    },
    {
        id: 'kt-1',
        language: 'kotlin',
        description: 'Data class and list filter',
        code: `data class User(val id: Int, val name: String)

fun main() {
    val users = listOf(User(1, "Alice"), User(2, "Bob"))
    val filtered = users.filter { it.id > 1 }
    println(filtered)
}`
    },
    {
        id: 'ts-1',
        language: 'typescript',
        description: 'Interface and generic function',
        code: `interface User {
  id: number;
  name: string;
}

function getFirst<T>(items: T[]): T {
  return items[0];
}`
    },
    {
        id: 'rs-1',
        language: 'rust',
        description: 'Struct and implementation',
        code: `struct Rect { width: u32, height: u32 }

impl Rect {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let r = Rect { width: 10, height: 20 };
    println!("Area: {}", r.area());
}`
    },
    {
        id: 'java-1',
        language: 'java',
        description: 'Simple Java Class',
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, TypeDev!");
    }
}

class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
}`
    },
    {
        id: 'cpp-1',
        language: 'cpp',
        description: 'C++ Vector and Loop',
        code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums = {1, 2, 3};
    for (int n : nums) {
        std::cout << n << std::endl;
    }
    return 0;
}`
    }
];
