import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// -------- Screen 1: Task list --------
function TaskListScreen({ navigation, tasks, onToggleDone }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() =>
        navigation.navigate("TaskForm", {
          taskToEdit: item,
        })
      }
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          item.done ? styles.checkboxDone : styles.checkboxNotDone,
        ]}
        onPress={() => onToggleDone(item.id)}
      >
        {item.done ? <Text style={styles.checkboxText}>✓</Text> : null}
      </TouchableOpacity>

      <View style={styles.taskTextContainer}>
        <Text
          style={[styles.taskTitle, item.done ? styles.taskTitleDone : null]}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Add Task"
        onPress={() => navigation.navigate("TaskForm")}
      />

      {tasks.length === 0 ? (
        <Text style={styles.emptyText}>
          You have no tasks yet. Tap "Add Task" to create your first one!
        </Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
        />
      )}
    </View>
  );
}

// -------- Screen 2: Task form --------
function TaskFormScreen({ route, navigation, onAddTask, onUpdateTask }) {
  const taskToEdit = route?.params?.taskToEdit;
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
    }
  }, [taskToEdit]);

  const handleSave = () => {
    if (!title || title.trim() === "") {
      Alert.alert("Missing title", "Please enter a task title.");
      return;
    }

    if (taskToEdit) {
      const updatedTask = {
        ...taskToEdit,
        title: title.trim(),
      };
      onUpdateTask(updatedTask);
    } else {
      onAddTask(title.trim());
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Study for exam"
      />

      <Button
        title={taskToEdit ? "Update Task" : "Save Task"}
        onPress={handleSave}
      />
    </View>
  );
}

// -------- Main App with navigation + state --------
export default function App() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (title) => {
    if (!title || title.trim() === "") return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      done: false,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleToggleDone = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TaskList" options={{ title: "SimpleTask" }}>
          {(props) => (
            <TaskListScreen
              {...props}
              tasks={tasks}
              onToggleDone={handleToggleDone}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="TaskForm" options={{ title: "Add / Edit Task" }}>
          {(props) => (
            <TaskFormScreen
              {...props}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// -------- Styles --------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  list: {
    marginTop: 16,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxNotDone: {
    borderWidth: 1,
    borderColor: "#999",
  },
  checkboxDone: {
    backgroundColor: "#4CAF50",
  },
  checkboxText: {
    color: "white",
    fontWeight: "bold",
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
});
