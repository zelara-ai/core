import { DEVICE_LINKING } from '@zelara/shared';
import { TaskRequest, TaskResponse } from './types';

/**
 * Handles task offloading to linked devices
 * Platform-specific implementations handle actual network communication
 */
export class TaskOffloader {
  private pendingTasks: Map<string, (response: TaskResponse) => void> = new Map();

  /**
   * Offload task to linked device
   * Returns promise that resolves when task completes
   */
  async offloadTask(request: TaskRequest): Promise<TaskResponse> {
    return new Promise((resolve, reject) => {
      // Store callback
      this.pendingTasks.set(request.taskId, resolve);

      // Set timeout
      setTimeout(() => {
        if (this.pendingTasks.has(request.taskId)) {
          this.pendingTasks.delete(request.taskId);
          reject(new Error('Task timeout'));
        }
      }, DEVICE_LINKING.CONNECTION_TIMEOUT_MS);

      // Platform-specific implementation will send request
      // and call handleTaskResponse when response arrives
      this.sendRequest(request).catch((error) => {
        this.pendingTasks.delete(request.taskId);
        reject(error);
      });
    });
  }

  /**
   * Handle task response from linked device
   */
  handleTaskResponse(response: TaskResponse): void {
    const callback = this.pendingTasks.get(response.taskId);
    if (callback) {
      callback(response);
      this.pendingTasks.delete(response.taskId);
    }
  }

  /**
   * Send request to linked device
   * Platform-specific implementations override this
   */
  protected async sendRequest(request: TaskRequest): Promise<void> {
    throw new Error('sendRequest must be implemented by platform-specific subclass');
  }

  /**
   * Create image validation task request
   */
  createImageValidationRequest(imageData: string): TaskRequest {
    return {
      taskId: this.generateTaskId(),
      taskType: 'image_validation',
      payload: { imageData },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate unique task ID
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
