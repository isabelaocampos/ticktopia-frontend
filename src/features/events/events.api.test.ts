import axiosServer from "../../shared/lib/axiosServer";
import { Event } from "@/shared/types/event";
import {getEvents } from "./events.api";

// Mock axiosServer
jest.mock("../../shared/lib/axiosServer");

describe("Event API Functions", () => {
  const mockEvents: Event[] = [
    {
      id: "1",
      name: "Test Event 1",
      bannerPhotoUrl: "banner1.jpg",
      isPublic: true,
      user: {
        id: "user1",
        email: "user1@test.com",
        name: "User",
        lastname: "One",
        isActive: true,
        roles: ["admin"],
      },
    },
    {
      id: "2",
      name: "Test Event 2",
      bannerPhotoUrl: "banner2.jpg",
      isPublic: false,
      user: {
        id: "user2",
        email: "user2@test.com",
        name: "User",
        lastname: "Two",
        isActive: true,
        roles: ["client"],
      },
    },
  ];

  const mockEventData = {
    event: mockEvents[0],
    presentations: [
      {
        idPresentation: "1",
        place: "Venue 1",
        event: mockEvents[0],
        capacity: 100,
        price: 50,
        openDate: "2023-01-01",
        startDate: "2023-01-02",
        latitude: 0,
        longitude: 0,
        description: "Test description",
        ticketAvailabilityDate: "2023-01-01",
        ticketSaleAvailabilityDate: "2023-01-01",
        city: "Test City",
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getEvents", () => {
    it("should fetch events with default parameters", async () => {
      (axiosServer.get as jest.Mock).mockResolvedValue({ data: mockEvents });

      const result = await getEvents();

      expect(axiosServer.get).toHaveBeenCalledWith("/event/findAll", {
        params: {
          limit: "10",
          offset: "0",
        },
      });
      expect(result).toEqual(mockEvents);
    });

    it("should fetch events with custom parameters", async () => {
      (axiosServer.get as jest.Mock).mockResolvedValue({ data: mockEvents });

      const params = { limit: 5, offset: 20 };
      const result = await getEvents(params);

      expect(axiosServer.get).toHaveBeenCalledWith("/event/findAll", {
        params: {
          limit: "5",
          offset: "20",
        },
      });
      expect(result).toEqual(mockEvents);
    });

    it("should handle API errors", async () => {
      (axiosServer.get as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(getEvents()).rejects.toThrow("API Error");
    });
  });

});