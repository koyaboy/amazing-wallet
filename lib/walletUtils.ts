import { User } from "./types/user.interface";
import { users } from "./users";

export function getUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function buyXyle(
  id: string,
  amount: number
): { success: boolean; message?: string } {
  const user = getUser(id);
  if (!user) return { success: false, message: "User not found" };

  if (!amount) {
    alert("Please input an amount");
    return { success: false };
  }

  if (user.usdtBalance >= amount) {
    user.usdtBalance -= amount;
    user.xyleBalance += amount;
    return { success: true };
  } else {
    return { success: false, message: "Insufficient USDT" };
  }
}

export function transferXyle(
  fromId: string,
  toId: string,
  amount: number
): { success: boolean; message?: string } {
  const fromUser = getUser(fromId);
  const toUser = getUser(toId);

  if (!fromUser || !toUser) return { success: false, message: "Invalid users" };

  if (fromUser.xyleBalance >= amount) {
    fromUser.xyleBalance -= amount;
    toUser.xyleBalance += amount;
    return { success: true };
  } else {
    return { success: false, message: "Insufficient XYLE" };
  }
}

// Simulated exchange rate
const XYLE_TO_USDT = 1;

export function convertXyleToUsdt(userId: string, xyleAmount: number): boolean {
  const user = users.find((u) => u.id === userId);
  if (!user) return false;

  if (user.xyleBalance >= xyleAmount) {
    user.xyleBalance -= xyleAmount;
    user.usdtBalance += xyleAmount * XYLE_TO_USDT;
    return true;
  } else {
    console.warn("Insufficient XYLE balance");
    return false;
  }
}
